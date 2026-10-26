"""Audit local page links and module destinations; use --fix to repair menu URLs."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import os
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
ROUTES = {
    'createParticipant': ('participants/create', {'register': 'register.html'}),
    'detailsParticipant': ('participants/details', {'list of farmers': 'all-with-status.html', 'inactive': 'inactive.html'}),
    'createFarmerAssociation': ('participants/create', {'register': 'fa-register.html'}),
    'detailsFarmerAssociation': ('participants/details', {'list of fa': 'fa-all-list.html', 'inactive': 'fa-inactive.html'}),
    'createTraining': ('training/create', {'register': 'register.html'}),
    'updateTraining': ('training/update', {'for review': 'for-review.html', 'for approval': 'for-approval.html'}),
    'detailsTraining': ('training/details', {'all status': 'all-status.html', 'approved & accepted': 'approved-accepted.html', 'incomplete': 'incomplete.html', 'inactive': 'inactive.html'}),
    'createFacilitatorRp': ('training/create', {'register': 'rp-register.html'}),
    'detailsFacilitatorRp': ('training/details', {'list of rp': 'rp-list.html', 'inactive': 'rp-inactive.html'}),
    'createEvaluation': ('evaluation/create', {'pre-test questionaire': 'pre-test-register.html', 'post-test questionaire': 'post-test-register.html', 'training evaluation': 'training-evaluation-register.html', 'resource person evaluation': 'rp-evaluation-register.html'}),
    'encodeEvaluation': ('evaluation/encode', {'pre-test evaluation': 'pre-test.html', 'post-test evaluation': 'post-test.html', 'training evaluation': 'training-evaluation.html', 'resource person evaluation': 'rp-evaluation.html'}),
    'detailsEvaluation': ('evaluation/details', {'draft questionnaires': 'draft-questionnaire.html', 'evaluation drafts': 'draft-questionnaire.html', 'list questionnaire': 'list-questionnaire.html', 'inactive': 'inactive.html'}),
    'createAdministration': ('administration/create', {'register': 'register.html'}),
    'updateAdministration': ('administration/update', {'for approval': 'for-approval.html'}),
    'detailsAdministration': ('administration/details', {'all status': 'all-status.html', 'approved & accepted': 'approved-accepted.html', 'inactive': 'inactive.html'}),
}
VOID = {'input', 'img', 'meta', 'link', 'br', 'hr', 'source', 'area', 'wbr', 'embed', 'param', 'col', 'base', 'track'}

class Links(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.links = []
        self.anchor = None
        self.lines = source.splitlines(keepends=True)
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a':
            line, column = self.getpos()
            self.anchor = {'href': attrs.get('href', ''), 'ids': [item[1] for item in self.stack if item[1]], 'text': '', 'start': sum(map(len, self.lines[:line-1])) + column, 'tag': self.get_starttag_text()}
        if tag not in VOID:
            self.stack.append((tag, attrs.get('id', '')))

    def handle_data(self, data):
        if self.anchor is not None:
            self.anchor['text'] += data

    def handle_endtag(self, tag):
        if tag == 'a' and self.anchor is not None:
            self.links.append(self.anchor)
            self.anchor = None
        for index in range(len(self.stack)-1, -1, -1):
            if self.stack[index][0] == tag:
                self.stack = self.stack[:index]
                break

def destination(page, href):
    url = urlsplit(href)
    if not href or href.startswith('#') or url.scheme or url.netloc or href.startswith('/'):
        return None
    return (page.parent / unquote(url.path)).resolve() if url.path else None

def expected(link):
    text = re.sub(r'\s+\d+$', '', ' '.join(link['text'].split())).lower()
    for context in reversed(link['ids']):
        context = re.sub(r'(HeaderCollapse|Mobile)$', '', context)
        if context in ROUTES:
            folder, entries = ROUTES[context]
            if text in entries:
                return ROOT / 'app/admin' / folder / entries[text]
    return None

def audit(fix=False):
    issues, changed, checked = [], 0, 0
    for page in sorted((ROOT / 'app').rglob('*.html')):
        source = page.read_text(encoding='utf-8-sig')
        edits = []
        for link in Links(source).links:
            checked += 1
            target, canonical = destination(page, link['href']), expected(link)
            if canonical is not None and target != canonical.resolve():
                if fix:
                    assert canonical.is_file(), canonical
                    href = os.path.relpath(canonical, page.parent).replace('\\', '/')
                    new_tag = re.sub(r'\bhref\s*=\s*(["\']).*?\1', lambda match: f'href={match[1]}{href}{match[1]}', link['tag'], count=1)
                    edits.append((link['start'], len(link['tag']), new_tag))
                    continue
                issues.append(f'{page.relative_to(ROOT)}: wrong module destination {link["href"]} ({link["text"].strip()})')
            if target is not None and not target.is_file():
                issues.append(f'{page.relative_to(ROOT)}: missing destination {link["href"]}')
        if edits:
            for start, length, tag in reversed(edits):
                source = source[:start] + tag + source[start+length:]
            page.write_text(source, encoding='utf-8')
            changed += 1
    return issues, changed, checked

if __name__ == '__main__':
    fix = '--fix' in sys.argv
    issues, changed, checked = audit(fix)
    if fix:
        issues, _, checked = audit()
    print(f'Checked {checked} page links; updated {changed} pages; {len(issues)} issues.')
    for issue in issues:
        print(issue)
    sys.exit(bool(issues))
