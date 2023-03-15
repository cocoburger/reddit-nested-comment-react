export function IconBtn({ Icon, isActive, color, children, ...props }) {
  return (
      <div
          className={ `btn icon-btn ${ isActive ? "icon-btn-active" : "" } ${
              color || ""
          }` }
          { ...props }
      >
      <span className={ `${ children != null ? "mr-1" : "" }` }>
        <Icon/>
      </span>
        { children }
      </div>
  );
}
