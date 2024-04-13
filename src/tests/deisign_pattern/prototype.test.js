class FifaOnlinePlayer {
  constructor(name, position, team, goals) {
    this.name = name;
    this.team = team;
    this.position = position;
    this.goals = goals;
  }

  score() {
    return this.goals++;
  }

  clone() {
    return new FifaOnlinePlayer(
      this.name,
      this.position,
      this.team,
      this.goals
    );
  }
}

FifaOnlinePlayer.prototype.stats = {
  minusplayed: 0,
};

// create new player
const prototypePattern = new FifaOnlinePlayer("CR7", "FW", "Al Nass", 100);

const cr7 = prototypePattern.clone();
const m10 = prototypePattern.clone();
m10.name = "messi";
m10.team = "inter miami";

cr7.score();
cr7.stats.minusplayed = 1000;
console.log(cr7);
console.log("cr7 stats: " + cr7.stats.minusplayed);

m10.score();
console.log(m10);
console.log("messi stats: " + m10.stats.minusplayed);
