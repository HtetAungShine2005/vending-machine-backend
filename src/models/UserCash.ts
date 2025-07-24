export class UserCash {
  private static instance: UserCash;
  private cash: number = 200; // Maximum amount a user can spend

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

  public spendCash(amount: number): void {
    this.cash -= amount;
  }

  public setCash(amount: number): void {
    this.cash = amount;
  }

  public reset(): void {
    this.cash = 200;
  }
}