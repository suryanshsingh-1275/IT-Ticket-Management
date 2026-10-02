export default function Avatar({ user, size = 32 }) {
  const style = { width: size, height: size, fontSize: size * 0.42 };

  if (user && user.avatar) {
    return (
      <img
        src={`http://localhost:5055${user.avatar}`}
        alt=""
        className="avatar"
        style={style}
      />
    );
  }

  const firstLetter = user && user.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <span className="avatar" style={style}>
      {firstLetter}
    </span>
  );
}