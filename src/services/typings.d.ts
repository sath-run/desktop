declare namespace API {
  type Response<T> = {
    status: number,
    msg: string;
    data: T
  }
  type LoginParams = {
    email: string;
    password: string;
  }
  type LoginResult = {
    token: string
    message: string
  }
  type LoginInfo = {
    isUser: boolean;
    token: string;
  }
  type UpdatePasswordParams = {
    account: string;
    password: string;
    code: string;
  }
  type CreateAccountParams = {
    name: string;
    account: string;
    code: string;
    password: string;
  }
  type JobsParams = {
    pageIndex: number,
    pageSize: number,
  }
  type JobsIntegralParams = {
    pageIndex: number,
    pageSize: number,
  }
}
