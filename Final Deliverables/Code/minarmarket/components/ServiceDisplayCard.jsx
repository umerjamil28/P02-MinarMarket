export function ServiceDisplayCard({ title, category, rate, pricingModel, status }) {
    return (
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p>Category: {category}</p>
        <p>Rate: {rate}</p>
        <p>Pricing Model: {pricingModel}</p>
        <p>Status: {status}</p>
      </div>
    );
  }
  
