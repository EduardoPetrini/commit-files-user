import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import simpleGit from 'simple-git';
import { logInfo } from './utils';

(async () => {
  const repoPath = process.env.REPO_PATH || '';
  const gitBranch = process.env.GIT_BRANCH || 'develop';
  const authorEmail = process.env.AUTHOR_EMAIL?.split(',') || [];
  const hashesIgnore = process.env.HASHES_IGNORE?.split(',') || [];

  const git = simpleGit(repoPath);

  const logOptions = {
    '--branches': `*${gitBranch}*`,
    '--no-merges': null,
    format: {
      hash: '%H',
      date: '%ai',
      message: '%s',
      author_name: '%an',
      author_email: '%ae',
    },
  };

  const log = await git.log(logOptions);

  const filteredCommits = authorEmail.length ? log.all.filter(commit => authorEmail.includes(commit.author_email) && !commit.message.includes('v1.55.3') && !commit.message.includes('conflict') && !hashesIgnore.includes(commit.hash)) : log.all;

  const setFiles = new Map();

  await Promise.all(
    filteredCommits.map(async commit => {
      const diff = await git.show([
        '--pretty=format:',
        '--name-status',
        commit.hash,
      ]);

      const files = diff
        .trim()
        .split('\n')
        .filter(line => line.length > 0)
        .map(line => {
          const [status, ...filePath] = line.split(/\t|\s/);
          return {
            status,
            path: filePath.join(' '),
          };
        });

      logInfo(commit.author_name, commit.date, files.length, commit.hash, commit.message);
      files.forEach(f => {
        let values = setFiles.get(f.path);
        if (!values) {
          values = [];
        }

        values.push(commit.hash);
        setFiles.set(f.path, values);
      });

      return files;
    })
  );

  let fileArr = Array.from(setFiles.keys());
  const writer = fs.createWriteStream('files.txt');
  fileArr.sort().forEach(async key => await writer.write(`${key} - ${setFiles.get(key).toString()}\n`));
})();
