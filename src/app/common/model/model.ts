export interface Car {
    id: string;
    /**
     * 车牌号
     */
    carNo: string;
    /**
     * 重量
     */
    weight: string;
}

export interface Person {
    id: string;
    /**
     * 名称
     */
    userName: string;
}

export interface Type {
    id: string;
    /**
     * 货料名称
     */
    typeName: string;
}

export interface Origin {
    id: string;
    /**
     * 公司名称
     */
    originName: string;
}
/** 车关联人,管理数据 */
export interface AccountCar extends Car {
    persons: Person[];
    datas: Data[];
}
export interface Table {
    /**
     * 车牌号
     */
    carNo: string;
    /**
     * 出厂时间
     */
    startTime: string;
    /**
     * 回厂时间
     */
    endTime: string;
    /**
     * 货料来源
     */
    origin: string;
    /**
     * 货料类型
     */
    type: string;
    /**
     * 毛重
     */
    maozhong: string;
    /**
     * 皮重
     */
    pizhong: string;
    /**
     * 净重
     */
    jingzhong: string;
    /**
     * 金额
     */
    amount: string;
    /**
     * 拍摄图片地址
     */
    img: string[];
    /**
     * 缩略图地址
     */
    thumbnail: string[];
}
export interface Data extends Table {
    id: string;
}

/** 账本格式 */
export interface AccountBook {
    id: string;
    date: string;
    cars: AccountCar[];
    outCars: OutCar[];
    guozhaCars: GuoZhaCar[];
    // persons: Person[];
    // datas: Data[];
}

export interface OutCar {
    /**
     * id
     */
    id: string;
    /**
     * 车牌号
     */
    carNo: string;
    /**
     * 来源
     */
    origin: string;
    /**
     * 类型
     */
    type: string;
    /**
     * 皮重
     */
    pizhong: string;
    /**
     * 扣秤
     */
    koucheng: string;
    /**
     * 毛重
     */
    maozhong: string;
    /**
     * 净重
     */
    jingzhong: string;
    /**
     * 单价
     */
    price: string;
    /**
     * 金额
     */
    amount: string;
    /**
     * 图片地址
     */
    img: string[];
    /**
     * 缩略图
     */
    thumbnail: string[];
}

/**
 * 果渣car
 */
export interface GuoZhaCar {
    /**
     * id
     */
    id: string;
    /**
     * 车牌号
     */
    carNo: string;
    /**
     * 来源
     */
    origin: string;
    /**
     * 类型
     */
    type: string;
    /**
     * 皮重
     */
    pizhong: string;
    /**
     * 扣秤
     */
    koucheng: string;
    /**
     * 毛重
     */
    maozhong: string;
    /**
     * 净重
     */
    jingzhong: string;
    /**
     * 单价
     */
    price: string;
    /**
     * 金额
     */
    amount: string;
    /**
     * 图片地址
     */
    img: string[];
    /**
     * 缩略图
     */
    thumbnail: string[];
}
