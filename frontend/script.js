const apiUrl = 'http://127.0.0.1:8000/api/books';
const booksList = document.getElementById('booksList');
const bookForm = document.getElementById('bookForm');
const addBookBtn = document.getElementById('addBookBtn');
const searchIdInput = document.getElementById('searchIdInput');
const searchIdBtn = document.getElementById('searchIdBtn');

// Функция для загрузки списка книг или конкретной книги по ID
function loadBooks(searchId = '') {
    let url = apiUrl;
    if (searchId) {
        url += `/${encodeURIComponent(searchId)}`;
    }
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Book not found');
            }
            return response.json();
        })
        .then(data => {
            booksList.innerHTML = ''; // Очищаем текущий список
            if (Array.isArray(data)) {
                // Если получен массив книг, отображаем все книги
                data.forEach(book => {
                    const bookItem = createBookItemElement(book);
                    booksList.appendChild(bookItem);
                });
            } else {
                // Если получена одна книга (поиск по ID), отображаем её
                const bookItem = createBookItemElement(data);
                booksList.appendChild(bookItem);
            }
        })
        .catch(error => {
            if (error.message === 'Book not found') {
                showErrorMessage('Book not found');
            } else {
                console.error('Error:', error);
            }
        });
}

// Функция для отображения сообщения об ошибке
function showErrorMessage(message) {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = message;
    errorMessage.style.color = 'red';
    booksList.innerHTML = ''; // Очищаем текущий список
    booksList.appendChild(errorMessage);
}

// Функция для создания элемента книги в списке
function createBookItemElement(book) {
    const bookItem = document.createElement('div');
    bookItem.classList.add('book-item');
    bookItem.innerHTML = `
        <p><strong>ID:</strong> ${book.id}</p>
        <p><strong>Title:</strong> ${book.title}</p>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Published Date:</strong> ${book.published_date}</p>
        <p><strong>ISBN:</strong> ${book.isbn}</p>
        <p><strong>Pages:</strong> ${book.pages}</p>
        <div class="btn-group">
            <button class="edit-btn btn" data-id="${book.id}">Edit</button>
            <button class="delete-btn btn" data-id="${book.id}">Delete</button>
        </div>
    `;
    return bookItem;
}

loadBooks(); // Загружаем список книг при загрузке страницы

// Обработчик для добавления книги
addBookBtn.addEventListener('click', function() {
    // Сброс формы и установка начальных значений
    document.getElementById('bookId').value = ''; // Очистить bookId
    bookForm.reset();
    bookForm.style.display = 'block';
    addBookBtn.style.display = 'none';
    document.getElementById('saveBtn').innerText = 'Add Book';
});

// Обработчик для сохранения книги (добавление или редактирование)
bookForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        published_date: document.getElementById('publishedDate').value,
        isbn: document.getElementById('isbn').value,
        pages: parseInt(document.getElementById('pages').value),
    };
    const id = document.getElementById('bookId').value;
    const url = id ? `${apiUrl}/${id}` : apiUrl;
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        loadBooks(); // После сохранения обновляем список книг
        bookForm.style.display = 'none';
        addBookBtn.style.display = 'block';
        bookForm.reset();
    })
    .catch(error => console.error('Error:', error));
});

// Обработчик для редактирования книги
booksList.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-btn')) {
        const id = event.target.dataset.id;
        fetch(`${apiUrl}/${id}`)
            .then(response => response.json())
            .then(book => {
                // Заполняем форму данными выбранной книги для редактирования
                document.getElementById('bookId').value = book.id;
                document.getElementById('title').value = book.title;
                document.getElementById('author').value = book.author;
                document.getElementById('publishedDate').value = book.published_date;
                document.getElementById('isbn').value = book.isbn;
                document.getElementById('pages').value = book.pages;
                bookForm.style.display = 'block';
                addBookBtn.style.display = 'none';
                document.getElementById('saveBtn').innerText = 'Save Changes';
            })
            .catch(error => console.error('Error:', error));
    }
});

// Обработчик для удаления книги
booksList.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const id = event.target.dataset.id;
        fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                loadBooks(); // После удаления обновляем список книг
            })
            .catch(error => console.error('Error:', error));
    }
});

// Обработчик для поиска книги по ID
searchIdBtn.addEventListener('click', function() {
    const searchId = searchIdInput.value.trim();
    if (searchId) {
        loadBooks(searchId);
    } else {
        alert('Please enter an ID to search.');
    }
});

// Обработчик для отмены добавления/редактирования книги
document.getElementById('cancelBtn').addEventListener('click', function() {
    bookForm.style.display = 'none';
    addBookBtn.style.display = 'block';
    bookForm.reset();
});
