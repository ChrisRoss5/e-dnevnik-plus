import { User, ClassInfo } from "@/store/state";

interface InitData {
  email: string;
  password: string;
  fullName: string;
  classesList: ClassInfo[];
}

export default function newUser(initData: InitData): User {
  return {
    ...initData,
    signedIn: true,
    settings: {},
  };
}
