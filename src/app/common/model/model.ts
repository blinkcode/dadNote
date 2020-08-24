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
    carNo: string;
    startTime: string;
    endTime: string;
    origin: string;
    type: string;
    maozhong: string;
    pizhong: string;
    jingzhong: string;
    amount: string;
    img: string;
}
export interface Data extends Table {
    id: string;
}

/** 账本格式 */
export interface AccountBook {
    id: string;
    date: string;
    cars: AccountCar[];
    // persons: Person[];
    // datas: Data[];
}
