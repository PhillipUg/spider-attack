export default class Userdetails {
  constructor() {
    this.score = 0;
    this.username = '';
  }

  setUser(username) {
    this.username = username;
    localStorage.setItem('name', username);
    return this.username;
  }

  getUser() {
    return this.username;
  }

  increaseScore() {
    this.score += 50;
    localStorage.setItem('score', this.score);
    return this.score;
  }

  getScore() {
    return this.score;
  }
}
