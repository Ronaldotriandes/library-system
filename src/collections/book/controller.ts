import { Request, Response } from 'express';
import moment from 'moment';
import service from './service';
import { SuccessCreated, SuccessOK, SuccessOKMeta } from '../../lib/response';

export class PaymentController {
  public async getAllData(req: Request, res: Response): Promise<any> {
    const result = await service.getAllData(req.query);
    const { data } = result;
    return SuccessOKMeta(res, data, 'Success', result.meta);
  }

  public async save(req: Request, res: Response): Promise<any> {
    const result = await service.saveData(req.body);
    return SuccessCreated(res, result);
  }

  public async getById(req: Request, res: Response): Promise<any> {
    const result = await service.findById(req.params.id);
    return SuccessOK(res, result, 'Success get data');
  }

  public async update(req: Request, res: Response): Promise<any> {
    const result = await service.update(req.params.id, req.body);
    return SuccessOK(res, result, 'Book Update Successfully');
  }

  public async delete(req: Request, res: Response): Promise<any> {
    const result = await service.deleteById(req.params.id);
    return SuccessOK(res, result, 'Book Delete Successfully');
  }
}

export default new PaymentController();
