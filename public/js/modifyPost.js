const updatePostHandler = async (event) => {
    event.preventDefault();

    const id = event.target.getAttribute('data-id');

    const title = document.querySelector('#title').value.trim();
    const content = document.querySelector('#content').value.trim();

    if (id && title && content) {
        const response = await fetch(`/api/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ title, content }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            document.location.replace('/profile');
        } else {
            alert('Failed to update post');
        }
    }
};

const delPostHandler = async (event) => {
    if (event.target.hasAttribute('data-id')) {
        const id = event.target.getAttribute('data-id');

        const response = await fetch(`/api/posts/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            document.location.replace('/profile');
        } else {
            alert('Failed to delete post');
        }
    }
};

document
    .querySelector('.post-form')
    .addEventListener('submit', updatePostHandler);

document
    .getElementById('delete')
    .addEventListener('click', delPostHandler);