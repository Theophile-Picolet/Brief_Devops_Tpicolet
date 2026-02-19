import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BackButton from "../BackButton/BackButton";

describe("BackButton component", () => {
  it("affiche le label par défaut 'Retour aux articles'", () => {
    render(<BackButton />);
    expect(screen.getByText("Retour aux articles")).toBeInTheDocument();
  });

  it("affiche un label personnalisé", () => {
    render(<BackButton label="Retour à l'accueil" />);
    expect(screen.getByText("Retour à l'accueil")).toBeInTheDocument();
  });

  it("a le href par défaut '/articles'", () => {
    render(<BackButton />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/articles");
  });

  it("accepte un href personnalisé", () => {
    render(<BackButton href="/custom" label="Retour" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/custom");
  });

  it("applique les classes CSS personnalisées", () => {
    render(<BackButton className="custom-class" />);
    const link = screen.getByRole("link");
    expect(link).toHaveClass("custom-class");
  });

  it("contient une icône SVG de flèche", () => {
    const { container } = render(<BackButton />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
