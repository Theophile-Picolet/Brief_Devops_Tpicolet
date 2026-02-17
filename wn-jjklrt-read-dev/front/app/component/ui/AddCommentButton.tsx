import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AddCommentButtonProps {
  articleTitle: string;
  onCommentAdded?: () => void;
}

const AddCommentButton: React.FC<AddCommentButtonProps> = ({ articleTitle, onCommentAdded }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  // useEffect pour rafraîchir la page après un submit réussi
  useEffect(() => {
    if (shouldRefresh) {
      const timer = setTimeout(() => {
        window.location.reload();
        setShouldRefresh(false);
      }, 2000); // Attendre 2 secondes pour que l'utilisateur voit le message de succès
      
      return () => clearTimeout(timer);
    }
  }, [shouldRefresh]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError(null);
    setSuccess(null);
    setDescription("");
  };

  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();
    if (!description.trim()) {
      setError("Le commentaire ne peut pas être vide.");
      return;
    }
    if (description.length > 1000) {
      setError("Le commentaire ne doit pas dépasser 1000 caractères.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = `http://localhost:8002/api/articles/${encodeURIComponent(articleTitle)}/comments`;
      const payload = { description };
      
      console.info("[AddComment] API call:", { url, payload });
      
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      console.info("[AddComment] Response status:", res.status);
      console.info("[AddComment] Response headers:", Object.fromEntries(res.headers.entries()));
      
      if (!res.ok) {
        const errorText = await res.text();
        console.info("[AddComment] Error response body:", errorText);
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }
      
      const responseData = await res.json();
      console.info("[AddComment] Response data:", responseData);
      
      // Fermer la modale et nettoyer
      setOpen(false);
      setDescription("");
      setError(null);
      
      // Afficher le message de succès
      setSuccess("Commentaire bien envoyé !");
      setTimeout(() => setSuccess(null), 3000);
      
      // Callback pour rafraîchir les commentaires
      if (onCommentAdded) onCommentAdded();
      
      // Déclencher le rafraîchissement de la page
      setShouldRefresh(true);
    } catch (err: any) {
      console.error("Erreur envoi commentaire:", err);
      setError(err.message || "Erreur inconnue lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800 mb-4"
        onClick={handleOpen}
      >
        Ajouter un commentaire
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative border border-gray-200">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              onClick={handleClose}
              aria-label="Fermer"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-black">Ajouter un commentaire</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                className="w-full border border-gray-300 rounded p-2 mb-2 text-black"
                rows={5}
                maxLength={1000}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Votre commentaire..."
                required
              />
              {error && <div className="text-red-500 mb-2">{error}</div>}
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 mt-2 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Envoi en cours..." : "Ajouter le commentaire"}
              </button>
            </form>
          </div>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        </div>
      )}
      {success && (
        <div className="animate-fade-in-out bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">{success}</span>
          </div>
          <small className="text-green-600 block mt-1">Votre commentaire apparaîtra après actualisation</small>
        </div>
      )}
    </>
  );
};

export default AddCommentButton;
