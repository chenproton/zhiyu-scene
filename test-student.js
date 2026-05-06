const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:3000/student.html', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: '/tmp/student-step0-scenario.png' });
  console.log('Screenshot saved: /tmp/student-step0-scenario.png');

  // 点击第一个任务的"开始学习"按钮
  const startBtn = await page.$('.task-item:first-child .task-status-btn.start');
  if (!startBtn) {
    console.log('No start button found!');
    await browser.close();
    return;
  }

  console.log('Clicking "开始学习" button...');
  await startBtn.click();
  await new Promise(r => setTimeout(r, 3000));

  await page.screenshot({ path: '/tmp/student-step1-after-btn-click.png' });
  console.log('Screenshot saved: /tmp/student-step1-after-btn-click.png');

  const isActive = await page.evaluate(() => {
    const el = document.getElementById('taskLearningView');
    return el && el.classList.contains('active');
  });
  console.log('taskLearningView active:', isActive);

  // 向下滚动查看是否有测评内容
  await page.evaluate(() => window.scrollTo(0, 800));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/tmp/student-step2-scrolled.png' });
  console.log('Screenshot saved: /tmp/student-step2-scrolled.png');

  await browser.close();
})();
