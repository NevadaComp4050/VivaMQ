import AdminPanelLayout from "~/components/components/panel-layout";

export default function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
