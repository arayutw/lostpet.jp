import { Component, InitOptions } from "../../component";

export class Me extends Component {
    session: number | null = null
    user: number | null = null

    constructor(options: InitOptions) {
        super({
            P: options.P,
        });
    }

    update(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.window!.fetch({
                credentials: true,
                method: "GET",
                path: "me",
            })
                .then((res: {
                    session: null | number
                    user: null | number
                }) => {
                    if (this.S) {
                        this.session = res.session;
                        this.user = res.user;

                        resolve();
                    }
                })
                .catch((err) => {
                    if (this.S) {
                        console.error(err);
                        this.window!.throw();
                    }
                })
                .finally(reject);
        });
    }
}


/*
メモ:
SESSIONの種類
・案件 (session id)
・ゲストコメント (session id)
・ユーザー (session id => user id)
*/