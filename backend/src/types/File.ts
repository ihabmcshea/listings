export type IFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

export interface MulterRequest extends Request {
  file: any;
  files: any[];
}
