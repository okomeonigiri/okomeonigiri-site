/**
 * localStorage使い方ガイド
 * localStorageの基本的な使い方と実装例
 * 
 * このファイルは教育目的で作成されており、localStorageの様々な使用方法を示します。
 */

// ==============================
// 基本的なlocalStorageの使い方
// ==============================

console.log("=== localStorage基本的な使い方 ===");

// 1. データの保存
localStorage.setItem('name', 'おにぎり');
localStorage.setItem('age', '25');
console.log("データを保存しました");

// 2. データの取得
const name = localStorage.getItem('name');
const age = localStorage.getItem('age');
console.log(`名前: ${name}, 年齢: ${age}`);

// 3. データの削除
localStorage.removeItem('age');
console.log("年齢データを削除しました");

// 4. 全てのデータを削除
// localStorage.clear(); // 注意：全てのデータが削除されます

// ==============================
// オブジェクトの保存と取得
// ==============================

console.log("\n=== オブジェクトの保存と取得 ===");

// オブジェクトはJSON文字列として保存する必要があります
const userData = {
    name: 'おにぎり',
    email: 'onigiri@example.com',
    preferences: {
        theme: 'dark',
        language: 'ja'
    }
};

// オブジェクトを文字列化して保存
localStorage.setItem('userData', JSON.stringify(userData));
console.log("ユーザーデータを保存しました");

// オブジェクトを取得してパース
const savedUserData = JSON.parse(localStorage.getItem('userData'));
console.log("保存されたユーザーデータ:", savedUserData);

// ==============================
// 配列の保存と取得
// ==============================

console.log("\n=== 配列の保存と取得 ===");

const todoList = [
    { id: 1, task: 'YouTubeを見る', completed: false },
    { id: 2, task: 'コードを書く', completed: true },
    { id: 3, task: 'localStorageを学ぶ', completed: false }
];

// 配列を保存
localStorage.setItem('todoList', JSON.stringify(todoList));

// 配列を取得
const savedTodoList = JSON.parse(localStorage.getItem('todoList') || '[]');
console.log("保存されたTODOリスト:", savedTodoList);

// ==============================
// エラーハンドリング
// ==============================

console.log("\n=== エラーハンドリング ===");

function safeGetFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error(`localStorage読み込みエラー: ${error.message}`);
        return defaultValue;
    }
}

function safeSetToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`localStorage保存エラー: ${error.message}`);
        return false;
    }
}

// 使用例
const safeData = safeGetFromStorage('userData', {});
console.log("安全に取得したデータ:", safeData);

// ==============================
// YouTube視聴履歴の実装例
// ==============================

console.log("\n=== YouTube視聴履歴の実装例 ===");

class YouTubeHistory {
    constructor() {
        this.storageKey = 'yt_history';
        this.maxHistoryItems = 100;
        this.history = this.loadHistory();
    }

    // 履歴を読み込み
    loadHistory() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('履歴読み込みエラー:', error);
            return [];
        }
    }

    // 履歴を保存
    saveHistory() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.history));
            return true;
        } catch (error) {
            console.error('履歴保存エラー:', error);
            return false;
        }
    }

    // 動画を履歴に追加
    addVideo(videoId, title = '') {
        const timestamp = new Date().toISOString();
        const videoEntry = {
            id: videoId,
            title: title,
            watchedAt: timestamp
        };

        // 既存のエントリを削除（重複を避ける）
        this.history = this.history.filter(item => item.id !== videoId);
        
        // 新しいエントリを先頭に追加
        this.history.unshift(videoEntry);

        // 最大件数制限
        if (this.history.length > this.maxHistoryItems) {
            this.history = this.history.slice(0, this.maxHistoryItems);
        }

        return this.saveHistory();
    }

    // 履歴を取得
    getHistory(limit = null) {
        return limit ? this.history.slice(0, limit) : this.history;
    }

    // 特定の動画を削除
    removeVideo(videoId) {
        this.history = this.history.filter(item => item.id !== videoId);
        return this.saveHistory();
    }

    // 履歴をクリア
    clearHistory() {
        this.history = [];
        localStorage.removeItem(this.storageKey);
        return true;
    }

    // 検索
    searchHistory(query) {
        return this.history.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.id.includes(query)
        );
    }
}

// 使用例
const ytHistory = new YouTubeHistory();

// 動画を追加
ytHistory.addVideo('dQw4w9WgXcQ', 'Rick Astley - Never Gonna Give You Up');
ytHistory.addVideo('jNQXAC9IVRw', 'Me at the zoo');

// 履歴を表示
console.log("現在の履歴:", ytHistory.getHistory());

// 検索
const searchResults = ytHistory.searchHistory('Rick');
console.log("検索結果:", searchResults);

// ==============================
// 実用的なユーティリティ関数
// ==============================

console.log("\n=== 実用的なユーティリティ関数 ===");

const StorageUtils = {
    // ストレージの使用量を取得
    getStorageSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return total;
    },

    // ストレージの使用量を人間が読める形式で表示
    getReadableStorageSize() {
        const bytes = this.getStorageSize();
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    },

    // 全てのキーを取得
    getAllKeys() {
        return Object.keys(localStorage);
    },

    // ストレージの内容を全て表示
    dumpStorage() {
        const dump = {};
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                try {
                    dump[key] = JSON.parse(localStorage[key]);
                } catch {
                    dump[key] = localStorage[key];
                }
            }
        }
        return dump;
    },

    // 期限付きストレージ
    setItemWithExpiry(key, value, ttl) {
        const now = new Date();
        const item = {
            value: value,
            expiry: now.getTime() + ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    },

    getItemWithExpiry(key) {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;

        try {
            const item = JSON.parse(itemStr);
            const now = new Date();
            
            if (now.getTime() > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            return item.value;
        } catch {
            return null;
        }
    }
};

// 使用例
console.log("ストレージサイズ:", StorageUtils.getReadableStorageSize());
console.log("全てのキー:", StorageUtils.getAllKeys());

// 期限付きデータの保存（5分後に期限切れ）
StorageUtils.setItemWithExpiry('tempData', 'これは5分で消える', 5 * 60 * 1000);

// ==============================
// 注意点とベストプラクティス
// ==============================

console.log("\n=== 注意点とベストプラクティス ===");
console.log(`
1. 容量制限
   - localStorageの容量は通常5-10MBまで
   - 大量のデータを保存する場合は注意が必要

2. データ型
   - localStorageは文字列のみ保存可能
   - オブジェクトや配列はJSON.stringify/parseを使用

3. 同期処理
   - localStorageは同期的に動作するため、大量のデータの場合はパフォーマンスに注意

4. プライベートブラウジング
   - プライベートモードでは制限がある場合がある

5. セキュリティ
   - 機密情報は保存しない
   - XSS攻撃により読み取られる可能性がある

6. エラーハンドリング
   - 常にtry-catchでエラーハンドリングを行う
   - ストレージが満杯の場合やブラウザ設定による制限に対応

7. 互換性
   - 古いブラウザでは利用できない場合がある
   - フィーチャー検出を使用してサポート確認
`);

// ==============================
// フィーチャー検出
// ==============================

function isLocalStorageSupported() {
    try {
        const test = 'localStorage-test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

console.log("localStorage対応状況:", isLocalStorageSupported() ? "対応" : "非対応");