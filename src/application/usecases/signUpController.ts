export class SignUpController {
  handle(httpRequest: any): any {
    if (!httpRequest.body.email) return { statusCode: 400 };
    if (!httpRequest.body.password) return { statusCode: 400 };
  }
}
