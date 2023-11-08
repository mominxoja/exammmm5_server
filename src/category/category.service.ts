import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ){}

  async create(createCategoryDto: CreateCategoryDto, id: number) {
    const isExist = await this.categoryRepository.findBy({
      user:{id},
      title: createCategoryDto.title
    })
    
    if (isExist.length)  throw new BadRequestException('Bu kategory allaqachon mavjud');
    
    const newCategory = this.categoryRepository.create({
      title: createCategoryDto.title,
      user: { id }
    });

    return await this.categoryRepository.save(newCategory);
  }

  async findAll(id: number) {
    return await this.categoryRepository.find({
      where: { user: { id } },
      relations: ['transactions']
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
            where:{id},
            relations:{
              user: true,
              transactions: true
            }
          })

    this.checkCategoryExists(category);

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where:{id},
    })
    this.checkCategoryExists(category);

    await this.categoryRepository.update(id, updateCategoryDto);
    return await this.categoryRepository.update(id, updateCategoryDto)

  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOne({
      where:{id},
    })
    this.checkCategoryExists(category);

    return await this.categoryRepository.delete(id);
  }

  private checkCategoryExists(category: Category) {
    if (!category) {
      throw new NotFoundException('Kategoriya topilmadi');
    }
  }
}

