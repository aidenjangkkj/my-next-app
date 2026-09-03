import { useState, type FormEvent } from "react";
import { type PostFormValues, validatePostInput } from "@/lib/blog";

interface PostFormProps {
  initialValues: PostFormValues;
  submitLabel: string;
  onSubmit: (values: PostFormValues) => Promise<void>;
}

export default function PostForm({
  initialValues,
  submitLabel,
  onSubmit,
}: PostFormProps) {
  const [values, setValues] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validatePostInput(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit({
        title: values.title.trim(),
        content: values.content.trim(),
        createdAt: values.createdAt,
      });
    } catch (submitError) {
      console.error("게시글 저장 중 오류 발생:", submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "게시글을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="mb-2 block font-semibold">
          제목
        </label>
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              title: event.target.value,
            }))
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          maxLength={120}
          required
        />
      </div>

      <div>
        <label htmlFor="createdAt" className="mb-2 block font-semibold">
          작성일
        </label>
        <input
          id="createdAt"
          type="datetime-local"
          value={values.createdAt}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              createdAt: event.target.value,
            }))
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-2 block font-semibold">
          내용 (Markdown)
        </label>
        <textarea
          id="content"
          value={values.content}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              content: event.target.value,
            }))
          }
          className="min-h-[420px] w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm leading-7 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          required
        />
      </div>

      {error && (
        <p
          className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "저장 중..." : submitLabel}
      </button>
    </form>
  );
}
