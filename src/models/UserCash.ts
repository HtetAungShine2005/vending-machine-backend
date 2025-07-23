export class UserCash {
  private static instance: UserCash;
  private cash: number = 200;

  private constructor() {}

  public static getInstance(): UserCash {
    if (!UserCash.instance) {
      UserCash.instance = new UserCash();
    }
    return UserCash.instance;
  }

  public getCash(): number {
    return this.cash;
  }

  public addCash(amount: number): void {
    this.cash += amount;
  }

  public setCash(amount: number): void {
    this.cash = amount;
  }
} 