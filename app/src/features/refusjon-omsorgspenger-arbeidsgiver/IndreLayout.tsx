type IndreLayoutProps = {
  children: React.ReactNode;
};
export const IndreLayout = ({ children }: IndreLayoutProps) => {
  return (
    <div className="bg-bg-default px-5 py-6 rounded-md flex gap-6 flex-col mt-2">
      {children}
    </div>
  );
};
