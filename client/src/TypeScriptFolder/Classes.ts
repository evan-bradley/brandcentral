export namespace Classes {
  export class User {
    public FirstName: string;
    public LastName: string;
    public UserName: string;
    public Email: string;
    public Password: string;
    constructor(
      userName: string = "",
      email: string = "",
      password: string = "",
      firstName: string = "",
      lastName: string = ""
    ) {
      this.FirstName = firstName;
      this.LastName = lastName;
      this.UserName = userName;
      this.Email = email;
      this.Password = password;
    }
  }
}
