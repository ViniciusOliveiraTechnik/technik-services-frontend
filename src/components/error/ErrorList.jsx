export default function ErroList({ errors }) {
  return (
    <ul className="text-red-500 text-base md:text-lg">
      {errors.map((value, index) => (
        <li key={index} className="list-disc list-inside">
          {value}
        </li>
      ))}
    </ul>
  );
}
