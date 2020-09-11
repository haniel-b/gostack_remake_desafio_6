import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if (value > total && type === 'outcome') {
      throw new AppError('You have no balance', 400);
    }

    let verifyCategoryExistsAndGetId = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!verifyCategoryExistsAndGetId) {
      verifyCategoryExistsAndGetId = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(verifyCategoryExistsAndGetId);
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id: verifyCategoryExistsAndGetId.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
