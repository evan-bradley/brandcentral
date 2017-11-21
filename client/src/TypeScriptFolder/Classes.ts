export namespace Classes {
  export class User {
    public Id: string;
    public FirstName: string;
    public LastName: string;
    public UserName: string;
    public Email: string;
    public Password: string;

    constructor(id: string = "", userName: string = "", email: string = "",
     password: string = "", firstName: string = "", lastName: string = "") {
      this.Id = id;
      this.FirstName = firstName;
      this.LastName = lastName;
      this.UserName = userName;
      this.Email = email;
      this.Password = password;
    }
  }

  export class PasswordVerification {
    public CurrentPassword: string;
    public NewPassword: string;
    public VerifyNewPassword: string;

    constructor(currentPassword: string = "", newPassword: string = "", verifyNewPassword: string = "") {
      this.CurrentPassword = currentPassword;
      this.NewPassword = newPassword;
      this.VerifyNewPassword = verifyNewPassword;
    }

    Verify (currentPassword: string): boolean {
      return (this.CurrentPassword === currentPassword && this.NewPassword === this.VerifyNewPassword);
    }
  }

  export class Product {
    public id: string;
    public name : string;
    public description : string;
    public pictureUrl : string;
    public productUrl : string;

    constructor(id: string, name: string = "", description: string = "", pictureUrl: string, productUrl: string = "") {
      this.id = id;
      this.name = name;
      this.description = description;
      this.pictureUrl = pictureUrl;
      this.productUrl = productUrl;
    }
  }
}
