const { BadRequestError } = require("../core/error.response");
const RESOURCE = require("../models/resource.model");
const ROLE = require("../models/role.model");
class RbacService {
  /**
   * new resource
   * @param {string} name
   * @param {string} slug
   * @param {string} description
   */
  createResource = async ({
    name = "profile",
    slug = "p00001",
    description = "",
  }) => {
    try {
      const resource = await RESOURCE.create({
        src_name: name,
        src_slug: slug,
        src_description: description,
      });

      return resource;
    } catch (error) {
      return error;
    }
  };

  resourceList = async ({
    userId = 0,
    limit = 30,
    offset = 0,
    search = "",
  }) => {
    try {
      const resources = await RESOURCE.aggregate([
        {
          $project: {
            _id: 0,
            name: "$src_name",
            slug: "$src_slug",
            description: "$src_description",
            resourceId: "$_id",
            createAt: 1,
          },
        },
      ]);
      return resources;
    } catch (error) {
      return error;
    }
  };

  createRole = async ({
    name = "shop",
    slug = "s00001",
    description = "extend from shop or user",
    grants = [],
  }) => {
    try {
      const foundRole = await ROLE.findOne({
        name,
        slug,
      });
      if (foundRole) {
        throw new BadRequestError("Role is already in use");
      }

      const role = await ROLE.create({
        rol_name: name,
        rol_slug: slug,
        rol_description: description,
        rol_grants: grants,
      });

      return role;
    } catch (error) {
      return error;
    }
  };

  roleList = async ({ userId = 0, limit = 30, offset = 0, search = "" }) => {
    try {
      // const roles = await ROLE.find();
      const roles = await ROLE.aggregate([
        {
          $unwind: "$rol_grants",
        },
        {
          $lookup: {
            from: "Resources",
            localField: "rol_grants.resource",
            foreignField: "_id",
            as: "resource",
          },
        },
        {
          $unwind: "$resource",
        },
        {
          $project: {
            role: "$rol_name",
            resource: "$resource.src_name",
            action: "$rol_grants.action",
            attributes: "$rol_grants.attributes",
          },
        },
        {
          $unwind: "$action",
        },
        {
          $project: {
            _id: 0,
            role: 1,
            resource: 1,
            action: "$action",
            attributes: 1,
          },
        },
      ]);
      return roles;
    } catch (error) {
      return error;
    }
  };
}

module.exports = new RbacService();
