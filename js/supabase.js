// Supabase 配置
const SUPABASE_URL = 'https://slfyrftrgitapzhplgkv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZnlyZnRyZ2l0YXB6aHBsZ2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNzY4MDAsImV4cCI6MjA1NTY1MjgwMH0.dummykey';

// 初始化 Supabase 客户端
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 测试连接
async function testConnection() {
    console.log('测试 Supabase 连接...');
    try {
        const { data, error } = await supabase.from('applications').select('count', { count: 'exact', head: true });
        if (error) throw error;
        console.log('✅ Supabase 连接成功');
        return true;
    } catch (error) {
        console.error('❌ Supabase 连接失败:', error.message);
        return false;
    }
}

// 页面加载时测试连接
document.addEventListener('DOMContentLoaded', testConnection);
