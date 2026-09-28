import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from '../router';
import { supabase } from '../lib/supabase';
import { useSession } from '../account/useSession';
import { useT } from '../i18n/LocaleProvider';
import type { Rating } from '../data/useCatalogueMeta';

/**
 * Reviews under a product.
 *
 * Only published reviews are readable — that is a row policy, not a filter in
 * this file — so a review appears here once someone in the shop has approved
 * it. A member writes one; a guest is told to sign in rather than shown a form
 * that would be rejected.
 */

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  created_at: string;
  status: string;
}

function Stars({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <span className="stars" aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rounded ? 'on' : undefined}>
          ★
        </span>
      ))}
    </span>
  );
}

export function ProductReviews({ productId, rating }: { productId: string; rating?: Rating }) {
  const t = useT();
  const copy = t.reviews;
  const { session } = useSession();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [score, setScore] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    let live = true;

    void supabase
      .from('product_reviews')
      .select('id, rating, title, body, created_at, status')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (live) setReviews((data ?? []) as Review[]);
      });

    return () => {
      live = false;
    };
  }, [productId, sent]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || !session) return;
    if (body.trim().length < 5) return setError(copy.tooShort);

    setBusy(true);
    setError(null);
    const { error: insertError } = await supabase.from('product_reviews').insert({
      product_id: productId,
      user_id: session.user.id,
      rating: score,
      title: title.trim() || null,
      body: body.trim(),
      status: 'pending'
    });
    setBusy(false);
    if (insertError) return setError(copy.failed);

    setTitle('');
    setBody('');
    setSent(true);
  };

  const published = reviews.filter((review) => review.status === 'published');
  const mine = reviews.filter((review) => review.status !== 'published');

  return (
    <section className="reviews">
      <div className="reviews_head">
        <h2>{copy.title}</h2>
        {rating && rating.review_count > 0 ? (
          <p className="reviews_score">
            <Stars value={rating.average} />
            <strong>{rating.average.toFixed(1)}</strong>
            <span>{copy.count.replace('{n}', String(rating.review_count))}</span>
          </p>
        ) : (
          <p className="reviews_score muted">{copy.none}</p>
        )}
      </div>

      <ul className="review_list">
        {published.map((review) => (
          <li key={review.id}>
            <div className="review_top">
              <Stars value={review.rating} />
              <span className="review_date">{new Date(review.created_at).toLocaleDateString()}</span>
            </div>
            {review.title ? <h3>{review.title}</h3> : null}
            <p>{review.body}</p>
          </li>
        ))}
      </ul>

      {mine.length > 0 ? <p className="review_pending">{copy.pending}</p> : null}

      {session ? (
        <form className="review_form" onSubmit={submit}>
          <h3>{copy.writeTitle}</h3>

          <div className="review_stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={n <= score ? 'on' : undefined}
                aria-label={`${n} / 5`}
                onClick={() => setScore(n)}
              >
                ★
              </button>
            ))}
          </div>

          <input
            className="form-control"
            type="text"
            placeholder={copy.titleLabel}
            aria-label={copy.titleLabel}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <textarea
            className="form-control form-textarea"
            rows={5}
            placeholder={copy.bodyLabel}
            aria-label={copy.bodyLabel}
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />

          {error ? <p className="form_error">{error}</p> : null}
          {sent ? <p className="form_notice">{copy.thanks}</p> : null}

          <button type="submit" className="btn_dark" disabled={busy}>
            {busy ? copy.sending : copy.submit}
          </button>
        </form>
      ) : (
        <p className="review_signin">
          <Link to="/member/login">{copy.signInToWrite}</Link>
        </p>
      )}
    </section>
  );
}
