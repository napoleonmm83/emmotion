export const metadata = {
  title: "Sanity Studio | emmotion.ch",
  description: "Content Management für emmotion.ch",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
