'use client'
import { useState } from "react";
import { Accordion, AccordionItem, Input, CheckboxGroup, Checkbox, Spacer, Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaginationControl } from "@/components/PaginationControl";
import { baseURL } from "@/services/api";

export default function BookList({ booksValues }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);
    const { books, totalPages, totalBooks, loading, availableCategories, availableYears } = booksValues;
    const router = useRouter()
    const searchParams = useSearchParams();

    const category = searchParams.get('category');
    const search = searchParams.get('search');
    let breadcrumbText = category || search;

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
        );
    };

    const handleYearChange = (year) => {
        setSelectedYears((prev) =>
            prev.includes(year) ? prev.filter((item) => item !== year) : [...prev, year]
        );
    };

    const filteredBooks = books.filter((book) => {
        console.log(book, selectedCategories, selectedYears);

        const categoryMatch = selectedCategories.length
            ? book.categories.some(category => selectedCategories.includes(category))
            : true;

        const yearMatch = selectedYears.length
            ? selectedYears.includes(book.year)
            : true;

        return categoryMatch && yearMatch;
    });

    return (
        <div className="page">
            <Breadcrumbs className="mb-8">
                <BreadcrumbItem>Inicial</BreadcrumbItem>
                {breadcrumbText && <BreadcrumbItem>{breadcrumbText}</BreadcrumbItem>}
            </Breadcrumbs>

            <div className="flex justify-between">
                <div className="filters-list">
                    <Accordion selectionMode="multiple" defaultSelectedKeys='all'>
                        <AccordionItem key="1" startContent={<CheckboxGroup label="Categoria"></CheckboxGroup>} textValue="Categoria">
                            {/* <Input type="text" placeholder="Pesquise a categoria" className="search-input-filter" /> */}
                            <CheckboxGroup>
                                {availableCategories?.map((category) => (
                                    <Checkbox
                                        key={category.id}
                                        value={category.id}
                                        onChange={() => handleCategoryChange(category.id)}
                                    >
                                        {category.name}
                                    </Checkbox>
                                ))}
                                <Spacer x={4} />
                            </CheckboxGroup>
                        </AccordionItem>

                        <AccordionItem key="2" startContent={<CheckboxGroup label="Ano"></CheckboxGroup>} textValue="Ano">
                            {/* <Input type="text" placeholder="Pesquise o ano" className="search-input-filter" /> */}
                            <CheckboxGroup>
                                {availableYears?.map((year) => (
                                    <Checkbox
                                        key={year}
                                        value={year}
                                        onChange={() => handleYearChange(year)}
                                    >
                                        {year}
                                    </Checkbox>
                                ))}
                                <Spacer x={4} />
                            </CheckboxGroup>
                        </AccordionItem>
                    </Accordion>
                </div>

                <div className="content">
                    {loading ? null :
                        <>
                            <h2 id="title-total-found">Total de {filteredBooks.length} registros</h2>

                            <div className="book-list">
                                {filteredBooks.map((book) => {
                                    return (
                                        <div className="book" key={book.id} onClick={() => router.push(`/booklist/${book.id}`)}>
                                            <div
                                                className="book-image"
                                                style={{
                                                    backgroundImage: book.image
                                                        ? `url(${baseURL}${book.image})`
                                                        : 'none',
                                                    backgroundColor: book.image ? 'transparent' : '#ddd',
                                                }}></div>
                                            <div className="title-and-rating">
                                                <span id="title" title={book.title}>{book.title}</span>

                                                {/* <div className="rating">
                                                    <span>✮</span>
                                                    <span>5.0</span>
                                                </div> */}
                                            </div>

                                            <span id="author">{book.author}</span>
                                            <span id="author">{book.year}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="books-pagination">
                                <PaginationControl
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    totalPages={totalPages}
                                />
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}
