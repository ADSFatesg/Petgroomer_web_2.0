// user.model.ts


import {employeeRetrive} from "./employee";

export interface User {
  id: string;
  login: string;
  role: string;
  employeeId:string;
}
