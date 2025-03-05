export class SignUpController {
  handle(httpRequest: any): any {
    if (!httpRequest.body.email)
      return { statusCode: 400, body: new Error('Missing param: email') };
    if (!httpRequest.body.password)
      return { statusCode: 400, body: new Error('Missing param: password') };
    if (!httpRequest.body.passwordConfirmation)
      return { statusCode: 400, body: new Error('Missing param: password confirmation') };
  }
}
