import Logo from "../../../components/ui/Logo";

const AuthLayout = ({
  children,
  title,
  subtitle,
  linkText,
  linkTo,
  LinkComponent,
}) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <Logo size="md" showText={false} />
          </div>

          <h1 className="mb-2 text-2xl font-bold text-slate-900">Hopper</h1>

          {title && (
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          )}

          {subtitle && LinkComponent && linkTo && linkText && (
            <p className="mt-2 text-sm text-slate-500">
              {subtitle}{" "}
              <LinkComponent
                to={linkTo}
                className="font-medium text-blue-600 transition-colors hover:text-blue-500"
              >
                {linkText}
              </LinkComponent>
            </p>
          )}
        </div>

        {/* Content */}
        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500">
          <span className="rounded-full bg-red-300 px-3 py-1 text-xs font-semibold text-red-800">
            Development
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
