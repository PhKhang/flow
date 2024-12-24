const formatPostDate = (created_at) => {
    const date = new Date(created_at);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); 

    const formattedDate = date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    let timeAgo;
    if (diff < 3600) { 
        const mins = Math.floor(diff / 60);
        timeAgo = `${mins}min`;
    } else if (diff < 86400) { 
        const hours = Math.floor(diff / 3600);
        timeAgo = `${hours}h`;
    } else if (diff < 604800) { 
        const days = Math.floor(diff / 86400);
        timeAgo = `${days}d`;
    } else if (diff < 2592000) { 
        const weeks = Math.floor(diff / 604800);
        timeAgo = `${weeks}w`;
    } else if (diff < 31536000) { 
        const months = Math.floor(diff / 2592000);
        timeAgo = `${months}mo`;
    } else {
        const years = Math.floor(diff / 31536000);
        timeAgo = `${years}y`;
    }

    return {
        formattedDate,
        timeAgo
    };
};

export { formatPostDate };
