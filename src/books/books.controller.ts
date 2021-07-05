import { Body, Controller, Param, ParseIntPipe, Post, Req, UseGuards } from "@nestjs/common";
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/createBook.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import {Request} from "express"


@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Post()
  createBook(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Post(":id/borrow")
  @UseGuards(JwtAuthGuard)
  borrowBook(@Req() req: Request, @Param('id',   ParseIntPipe) id: number) {
    return this.booksService.borrow(req, id);
  }

  @Post("getSubscription")
  @UseGuards(JwtAuthGuard)
  getSubscription(@Req() req: Request) {
    return this.booksService.getSubscription(req.user);
  }
}
