interface PopupHeaderProps {
  code: string;
  isHot: boolean;
}

const PopupHeader = ({ code, isHot }: PopupHeaderProps) => {
  if (isHot) {
    return (
      <div className="popup-header popup-header--hot">
        <span className="popup-header-code">{code}</span>
      </div>
    );
  }

  return (
    <div className="popup-header popup-header--normal">
      <span className="popup-header-code">{code}</span>
    </div>
  );
};

export default PopupHeader;
