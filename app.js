//Book Class: Represents a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
//UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
      const books = Store.getBooks();

      books.forEach((book) => UI.addBookToList(book));
  }
  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement('tr');
    row.innerHTML= `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a onclick="M.toast({html: 'Book Deleted Successfully', displayLength: 1000})" href="#" class="btn-floating btn-large waves-effect waves-light red btn-small"><i class="small material-icons delete">delete</i></a></td>
    `;

    list.appendChild(row);
  }
  static deleteBook(el) {
      if(el.classList.contains('delete')) {
        el.parentElement.parentElement.parentElement.remove();
      }
  }


  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}
//Store Class: Handles Storage
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('book') === null) {
      books = [];
    }
    else {
      books = JSON.parse(localStorage.getItem('book'));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('book', JSON.stringify(books));

  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('book', JSON.stringify(books));
  }
}


//Events: Display Books
document.addEventListener('DOMContentLoader', UI.displayBooks());



//Event: Add a Books
document.querySelector('#book-form').addEventListener('submit', (e) => {
  //Prevent actual submit
  e.preventDefault();
  //Get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  //Validate
  if(title==='' || author==='' || isbn==='') {
    M.toast({html: 'Please fill in the details'});
  }
  else {
    //Instantiate book
    const book = new Book(title, author, isbn);

    //Add Book to UI
    UI.addBookToList(book);

    Store.addBook(book);
    M.toast({html: 'Book Added Successfully'})

    //Clear Fields
    UI.clearFields();
  }
});

//Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {

  //Remove book from UI
  UI.deleteBook(e.target);

  //Remove book from Store
  Store.removeBook(e.target.parentElement.parentElement.previousElementSibling.textContent);
});
