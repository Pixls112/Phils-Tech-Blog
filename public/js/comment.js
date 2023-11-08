const createCommentHandler = async (event) => {
    event.preventDefault();

    const content = document.querySelector('#content').value.trim();
    const post_id = event.target.getAttribute('data-id');

    if (content && post_id) {
        const response = await fetch(`/api/comments/`, {
            method: 'POST',
            body: JSON.stringify({ content, post_id }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response);

        if (response.ok) {
            // reload page with new comment
            document.location.replace(`/post/comments/${post_id}`);
        } else {
            alert('Failed to create comment');
        }
    }
};

document
    .querySelector('.post-form')
    .addEventListener('submit', createCommentHandler);