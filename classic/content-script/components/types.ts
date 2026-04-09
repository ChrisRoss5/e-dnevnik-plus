interface Ad {
  id: string;
  url: string;
  imgListUrl: string;
  imgFloaterUrl: string;
  backgroundColor: string;
  showFloaterOnce?: boolean;
  showFloaterUntilClosed?: boolean;
  targetUserTypes?: ("srednjoškolac" | "osnovnoškolac")[];
  targetClassYears?: number[];
  info?: string;
}

enum StorageKeys {
  userId = "userId",
  login = "login",
  adsClassic = "ads-classic",
  adsClassicHiddenFloaters = "ads-classic-hidden-floaters",
  firstTimeClassicVisitor = "first-time-classic-visitor",
}
