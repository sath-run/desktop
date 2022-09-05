declare namespace API {
  type Response<T> = {
    success: boolean,
    msg: string;
    data: T
  }
  type LoginParams = {
    account: string;
    password: string;
  }
  type LoginResult = {
    token: string
  }
  type CurrentUser = {
    name: string;
    avatar: string;
  }
  type UpdatePasswordParams = {
    account: string;
    password: string;
    code: string;
  }
  type GetCodeParams = {
    account: string;
  }
  type CreateAccountParams = {
    name: string;
    account: string;
    code: string;
    password: string;
  }
  type Option = {
    name: string;
    value: string;
  }
  type TaskJob = {
    id: number;
    algo?: string;
    status?: string;
    dispatchedAt?: number;
    completedAt?: number;
    progress?: number;
  }
  type JobsParams = {
    pageIndex: number,
    pageSize: number,
  }
  type TaskIntegral = {
    id: number;
    jobId: number;
    algo: string;
    score: number;
    dispatchedAt: string;
    completedAt: string;
  }
  type JobsIntegralParams = {
    pageIndex: number,
    pageSize: number,
  }
}
