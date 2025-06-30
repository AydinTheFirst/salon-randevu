interface SidebarGroupProps {
  children: React.ReactNode[];
  title: string;
}

export default function SidebarGroup({ children, title }: SidebarGroupProps) {
  return (
    <div className='grid gap-3'>
      <h3 className='text-sm font-semibold'>{title}</h3>
      <ul className='grid gap-1'>
        {children.map((child, index) => (
          <li key={index}>{child}</li>
        ))}
      </ul>
    </div>
  );
}
