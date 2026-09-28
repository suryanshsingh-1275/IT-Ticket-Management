export default function Avatar({ user, size = 32 }) {
  const style = { width: size, height: size, fontSize: size * 0.42 };
  if (user?.avatar) {
    return <img src={user.avatar} alt="" className="avatar" style={style} />;
  }
  return (
    <span className="avatar" style={style}>
      {(user?.name || '?').charAt(0).toUpperCase()}
    </span>
  );
}