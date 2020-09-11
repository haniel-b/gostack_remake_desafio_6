import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    const isAbleToDelete = await transactionsRepository.findOne({
      where: { id },
    });

    if (!isAbleToDelete) {
      throw new AppError('Transaction not found');
    }

    transactionsRepository.delete({ id });
  }
}

export default DeleteTransactionService;
