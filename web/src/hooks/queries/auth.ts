import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { queryClient } from '@/main'

export const currentUserQueryOptions = queryOptions({
  queryKey: ['me'],
  queryFn: () => api.getMe(),
  staleTime: Infinity,
})

export const auth = {
  currentUserQuery() {
    return useQuery({
      queryKey: ['me'],
      queryFn: () => api.getMe(),
      staleTime: Infinity,
    })
  },

  loginMutation() {
    return useMutation({
      mutationFn: ({ email, password }: { email: string; password: string }) =>
        api.login(email, password),
      onSuccess: async (user) => {
        await queryClient.setQueryData(['me'], user)
      },
    })
  },

  logoutMutation(onSuccess: () => Promise<void>) {
    return useMutation({
      mutationFn: api.logout,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['me'],
        })
        await onSuccess()
      },
    })
  },
}
