import type React from "react";
import { useEffect, useState } from "react";

interface Comment {
  id: number;
  description: string;
  created_at: string;
}

interface CommentsProps {
  articleTitle: string;
}

const Comments: React.FC<CommentsProps> = ({ articleTitle }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8002/api/articles/${encodeURIComponent(articleTitle)}/comments`,
        );
        if (!res.ok)
          throw new Error("Erreur lors du chargement des commentaires");
        const data = await res.json();
        setComments(data);
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [articleTitle]);

  if (loading) return <div>Chargement des commentaires...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (comments.length === 0)
    return <div>Aucun commentaire pour cet article.</div>;

  return (
    <div>
      <h3>Commentaires</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <div>{comment.description}</div>
            <small>
              Posté le {new Date(comment.created_at).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
