import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { MapPin } from 'lucide-react';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function Register() {
  const [serverError, setServerError] = useState<string>('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
    try {
      setServerError('');
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      
      await updateProfile(user, {
        displayName: data.name
      });

      navigate('/');
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setServerError('Cette adresse email est déjà utilisée');
          break;
        case 'auth/invalid-email':
          setServerError('Adresse email invalide');
          break;
        case 'auth/operation-not-allowed':
          setServerError('La création de compte est temporairement désactivée');
          break;
        case 'auth/weak-password':
          setServerError('Le mot de passe est trop faible');
          break;
        default:
          setServerError('Une erreur est survenue lors de l\'inscription');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <MapPin className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Créer un compte
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Ou{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              connectez-vous à votre compte
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {serverError && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-lg">
              {serverError}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Nom"
              {...register('name', {
                required: 'Nom requis',
                minLength: {
                  value: 2,
                  message: 'Le nom doit contenir au moins 2 caractères',
                },
              })}
              error={errors.name?.message}
            />

            <Input
              label="Email"
              type="email"
              {...register('email', {
                required: 'Email requis',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email invalide',
                },
              })}
              error={errors.email?.message}
            />

            <Input
              label="Mot de passe"
              type="password"
              {...register('password', {
                required: 'Mot de passe requis',
                minLength: {
                  value: 6,
                  message: 'Le mot de passe doit contenir au moins 6 caractères',
                },
              })}
              error={errors.password?.message}
            />

            <Input
              label="Confirmer le mot de passe"
              type="password"
              {...register('confirmPassword', {
                required: 'Confirmation du mot de passe requise',
                validate: (value) =>
                  value === watch('password') || 'Les mots de passe ne correspondent pas',
              })}
              error={errors.confirmPassword?.message}
            />
          </div>

          <Button type="submit" loading={isSubmitting} className="w-full">
            Créer un compte
          </Button>
        </form>
      </div>
    </div>
  );
}