import { v4 as UUID } from "uuid";

const GenerateUUIDService = (): string => {
  return UUID();
};

export default GenerateUUIDService;