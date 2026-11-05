import boutique from "@/assets/cevu-boutique.png.asset.json";

export default function Glasses3D() {
  return (
    <img
      src={boutique.url}
      alt="Boutique Cévu Optique"
      className="h-full w-full object-cover object-center"
    />
  );
}
